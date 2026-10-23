using System;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace PixelOfficeTycoon
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new GameForm());
        }
    }

    // A plain window that hosts the game. Saves live in %LOCALAPPDATA%\PixelOfficeTycoon\WebData.
    class GameForm : Form
    {
        readonly WebView2 web;
        readonly string appDir = AppDomain.CurrentDomain.BaseDirectory;
        readonly string dataDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "PixelOfficeTycoon", "WebData");
        bool closingReady, fullscreen;
        FormWindowState prevState;
        FormBorderStyle prevBorder;

        public GameForm()
        {
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
                cw.SetVirtualHostNameToFolderMapping("pixeloffice.game", appDir, CoreWebView2HostResourceAccessKind.Allow);
                cw.NewWindowRequested += (s, e) => { e.Handled = true; try { System.Diagnostics.Process.Start(e.Uri); } catch { } };
                cw.WebMessageReceived += (s, e) => { if (e.TryGetWebMessageAsString() == "fullscreen") ToggleFullscreen(); };
                await cw.AddScriptToExecuteOnDocumentCreatedAsync(
                    "window.addEventListener('keydown', function (e) { if (e.key === 'F11') { e.preventDefault(); window.chrome.webview.postMessage('fullscreen'); } });");
                cw.Navigate("https://pixeloffice.game/PixelOfficeTycoon.html");
            }
            catch (WebView2RuntimeNotFoundException)
            {
                MessageBox.Show("Pixel Office Tycoon needs the Microsoft Edge WebView2 Runtime. Install it from Microsoft, then open the game again.", "Pixel Office Tycoon");
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
