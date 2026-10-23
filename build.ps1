# Stitches src\ into the single playable PixelOfficeTycoon.html
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $root 'src'
$out = Join-Path $root 'PixelOfficeTycoon.html'
$head = [IO.File]::ReadAllText((Join-Path $src '00-head.html'))
$js = (Get-ChildItem $src -Filter '*.js' | Sort-Object Name | ForEach-Object { [IO.File]::ReadAllText($_.FullName) }) -join "`n"
$html = $head + "<script>`n(() => {`n'use strict';`n" + $js + "`n})();`n</script>`n</body>`n</html>`n"
[IO.File]::WriteAllText($out, $html, (New-Object System.Text.UTF8Encoding $false))
'built ' + $out + ' (' + [Math]::Round($html.Length / 1024) + ' KB)'
