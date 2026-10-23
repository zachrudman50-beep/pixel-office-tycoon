# Builds PixelOfficeTycoon.exe and installs it with Desktop and Start menu shortcuts.
# Needs the WebView2 SDK DLLs in app\lib (from the Microsoft.Web.WebView2 NuGet package):
#   lib\Microsoft.Web.WebView2.Core.dll, lib\Microsoft.Web.WebView2.WinForms.dll (net462 builds)
#   lib\WebView2Loader.dll (runtimes\win-x64\native)
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$lib = Join-Path $here 'lib'
$dest = Join-Path $env:LOCALAPPDATA 'Programs\PixelOfficeTycoon'
$csc = 'C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe'
New-Item -ItemType Directory -Force $dest | Out-Null
Copy-Item "$lib\Microsoft.Web.WebView2.Core.dll", "$lib\Microsoft.Web.WebView2.WinForms.dll", "$lib\WebView2Loader.dll", (Join-Path $here 'PixelOfficeTycoon.ico') $dest -Force
Copy-Item (Join-Path (Split-Path $here) 'PixelOfficeTycoon.html') $dest -Force
& $csc /nologo /target:winexe /platform:x64 /optimize+ "/out:$dest\PixelOfficeTycoon.exe" "/win32icon:$dest\PixelOfficeTycoon.ico" `
  "/r:$dest\Microsoft.Web.WebView2.Core.dll" "/r:$dest\Microsoft.Web.WebView2.WinForms.dll" /r:System.Windows.Forms.dll /r:System.Drawing.dll (Join-Path $here 'Program.cs')
if ($LASTEXITCODE -ne 0) { throw 'Compile failed' }
$sh = New-Object -ComObject WScript.Shell
foreach ($l in @((Join-Path ([Environment]::GetFolderPath('Desktop')) 'Pixel Office Tycoon.lnk'), (Join-Path ([Environment]::GetFolderPath('Programs')) 'Pixel Office Tycoon.lnk'))) {
  $s = $sh.CreateShortcut($l); $s.TargetPath = "$dest\PixelOfficeTycoon.exe"; $s.WorkingDirectory = $dest; $s.IconLocation = "$dest\PixelOfficeTycoon.exe,0"; $s.Save()
}
'Installed to ' + $dest
