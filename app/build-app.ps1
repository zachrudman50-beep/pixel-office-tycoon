# Builds the single-file PixelOfficeTycoon.exe (game + WebView2 DLLs embedded) into app\dist.
# Needs the WebView2 SDK DLLs in app\lib (from the Microsoft.Web.WebView2 NuGet package):
#   lib\Microsoft.Web.WebView2.Core.dll, lib\Microsoft.Web.WebView2.WinForms.dll (net462 builds)
#   lib\WebView2Loader.dll (runtimes\win-x64\native)
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$lib = Join-Path $here 'lib'
$dist = Join-Path $here 'dist'
$game = Join-Path (Split-Path $here) 'PixelOfficeTycoon.html'
$csc = 'C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe'
New-Item -ItemType Directory -Force $dist | Out-Null
& $csc /nologo /target:winexe /platform:x64 /optimize+ "/out:$dist\PixelOfficeTycoon.exe" "/win32icon:$here\PixelOfficeTycoon.ico" `
  "/r:$lib\Microsoft.Web.WebView2.Core.dll" "/r:$lib\Microsoft.Web.WebView2.WinForms.dll" /r:System.Windows.Forms.dll /r:System.Drawing.dll `
  "/resource:$lib\Microsoft.Web.WebView2.Core.dll,Microsoft.Web.WebView2.Core.dll" "/resource:$lib\Microsoft.Web.WebView2.WinForms.dll,Microsoft.Web.WebView2.WinForms.dll" `
  "/resource:$lib\WebView2Loader.dll,WebView2Loader.dll" "/resource:$game,PixelOfficeTycoon.html" (Join-Path $here 'Program.cs')
if ($LASTEXITCODE -ne 0) { throw 'Compile failed' }
'Built ' + (Join-Path $dist 'PixelOfficeTycoon.exe')
