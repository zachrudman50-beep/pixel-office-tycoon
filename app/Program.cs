using System;
using System.Drawing;
using System.IO;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace PixelOfficeTycoon
{
    // Single-file app: the game HTML and the WebView2 SDK DLLs are embedded resources.
    // Managed DLLs load straight from memory; the native loader and the game are unpacked
    // to %LOCALAPPDATA%\PixelOfficeTycoon on launch. Saves live in ...\WebData.
    static class Program
    {
        public static readonly string Home = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "PixelOfficeTycoon");

        [STAThread]
        static void Main(string[] args)
        {
            AppDomain.CurrentDomain.AssemblyResolve += ResolveEmbedded;
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Run(args);
        }

        static Assembly ResolveEmbedded(object sender, ResolveEventArgs e)
        {
            string name = new AssemblyName(e.Name).Name;
            if (name != "Microsoft.Web.WebView2.Core" && name != "Microsoft.Web.WebView2.WinForms") return null;
            byte[] bytes = ReadResource(name + ".dll");
            return bytes == null ? null : Assembly.Load(bytes);
        }

        public static byte[] ReadResource(string name)
        {
            using (Stream s = Assembly.GetExecutingAssembly().GetManifestResourceStream(name))
            {
                if (s == null) return null;
                using (MemoryStream ms = new MemoryStream()) { s.CopyTo(ms); return ms.ToArray(); }
            }
        }

        public static string Unpack(string resource, string folder)
        {
            Directory.CreateDirectory(folder);
            string path = Path.Combine(folder, resource);
            byte[] bytes = ReadResource(resource);
            if (!File.Exists(path) || new FileInfo(path).Length != bytes.Length || resource.EndsWith(".html")) File.WriteAllBytes(path, bytes);
            return path;
        }

        // Kept separate so WebView2 types are only touched after the resolver is registered.
        [MethodImpl(MethodImplOptions.NoInlining)]
        static void Run(string[] args)
        {
            string dataDir = Path.Combine(Home, "WebData");
            for (int i = 0; i < args.Length - 1; i++) if (args[i] == "--data") dataDir = args[i + 1];
            try
            {
                string loaderDir = Path.Combine(Home, "bin");
                Unpack("WebView2Loader.dll", loaderDir);
                CoreWebView2Environment.SetLoaderDllFolderPath(loaderDir);
                Unpack("PixelOfficeTycoon.html", Path.Combine(Home, "game"));
            }
            catch (Exception ex)
            {
                MessageBox.Show("The game could not unpack its files: " + ex.Message, "Pixel Office Tycoon");
                return;
            }
            Application.Run(new GameForm(dataDir, Path.Combine(Home, "game")));
        }
    }

    class GameForm : Form
    {
        readonly WebView2 web;
        readonly string dataDir, gameDir;
        bool closingReady, fullscreen;
        FormWindowState prevState;
        FormBorderStyle prevBorder;

        public GameForm(string dataDir, string gameDir)
        {
            this.dataDir = dataDir;
            this.gameDir = gameDir;
            Text = "Pixel Office Tycoon";
            BackColor = Color.FromArgb(28, 32, 50);
            StartPosition = FormStartPosition.CenterScreen;
            MinimumSize = new Size(900, 600);
            Rectangle wa = Screen.PrimaryScreen.WorkingArea;
            Size = new Size(Math.Min(1440, wa.Width), Math.Min(920, wa.Height));
            try { Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath); } catch { }

            web = new WebView2();
            web.Dock = DockStyle.Fill;
            web.DefaultBackgroundColor = BackColor;
            Controls.Add(web);

            Load += async (s, e) => await InitWeb();
            FormClosing += OnClosing;
        }

        async Task InitWeb()
        {
            try
            {
                Directory.CreateDirectory(dataDir);
                CoreWebView2Environment env = await CoreWebView2Environment.CreateAsync(null, dataDir, null);
                await web.EnsureCoreWebView2Async(env);
                CoreWebView2 cw = web.CoreWebView2;
                cw.Settings.AreDefaultContextMenusEnabled = false;
                cw.Settings.AreDevToolsEnabled = false;
                cw.Settings.IsStatusBarEnabled = false;
                cw.Settings.AreBrowserAcceleratorKeysEnabled = false;
                cw.Settings.IsZoomControlEnabled = false;
                cw.SetVirtualHostNameToFolderMapping("pixeloffice.game", gameDir, CoreWebView2HostResourceAccessKind.Allow);
                cw.NewWindowRequested += (s, e) => { e.Handled = true; try { System.Diagnostics.Process.Start(e.Uri); } catch { } };
                cw.WebMessageReceived += (s, e) => { if (e.TryGetWebMessageAsString() == "fullscreen") ToggleFullscreen(); };
                await cw.AddScriptToExecuteOnDocumentCreatedAsync(
                    "window.addEventListener('keydown', function (e) { if (e.key === 'F11') { e.preventDefault(); window.chrome.webview.postMessage('fullscreen'); } });");
                cw.Navigate("https://pixeloffice.game/PixelOfficeTycoon.html");
            }
            catch (WebView2RuntimeNotFoundException)
            {
                if (MessageBox.Show("Pixel Office Tycoon needs the free Microsoft Edge WebView2 Runtime, which this PC is missing. Open Microsoft's download page now?", "Pixel Office Tycoon", MessageBoxButtons.YesNo) == DialogResult.Yes)
                    try { System.Diagnostics.Process.Start("https://go.microsoft.com/fwlink/p/?LinkId=2124703"); } catch { }
                Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("The game could not start: " + ex.Message, "Pixel Office Tycoon");
                Close();
            }
        }

        // Give the game a moment to save before the window goes away.
        async void OnClosing(object sender, FormClosingEventArgs e)
        {
            if (closingReady || web.CoreWebView2 == null) return;
            e.Cancel = true;
            closingReady = true;
            try { await web.CoreWebView2.ExecuteScriptAsync("window.dispatchEvent(new Event('beforeunload'));"); } catch { }
            Close();
        }

        void ToggleFullscreen()
        {
            if (!fullscreen)
            {
                prevState = WindowState;
                prevBorder = FormBorderStyle;
                FormBorderStyle = FormBorderStyle.None;
                WindowState = FormWindowState.Normal;
                WindowState = FormWindowState.Maximized;
            }
            else
            {
                FormBorderStyle = prevBorder;
                WindowState = prevState;
            }
            fullscreen = !fullscreen;
        }
    }
}
