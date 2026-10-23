# Pixel Office Tycoon

A pixel-art idle game about growing a company from your mom's garage to the multiverse. Hire staff, decorate your office so they work better, sell the company to rebirth, go public, and merge with rival empires. It's built to take months to max out.

## Play

Download `PixelOfficeTycoon.html` and double-click it. It runs in any modern browser, even offline. Progress saves in the browser, and you can back it up from **Progress → More → Download save file**.

## What's in it

- 25 staff roles and 20 offices, from Mom's Garage to The Multiverse Lobby
- Office decorating: 98 pieces of furniture that fill your staff's energy, comfort, fun and focus needs, with placement synergies, matching set bonuses and seasonal items
- Staff who walk around the office, a day/night cycle that follows your real clock, and weather in the windows
- Three prestige layers: sell the company (rebirth), IPO, and mega mergers
- Named star talent with traits, a stock market, inbox decisions, 15 rivals to overtake, contracts and a research lab
- Break Room mini-games, 60 collectibles in crates, 18 skills, 204 upgrades and 562 achievements

## Project layout

| Path | What it is |
|---|---|
| `PixelOfficeTycoon.html` | The built, playable game (one file) |
| `src/` | Game source, split into parts |
| `build.ps1` | Joins `src/` into `PixelOfficeTycoon.html` |
| `app/` | Windows desktop app wrapper (C# WinForms + WebView2) |

## Building

Game: run `build.ps1` in PowerShell. It writes `PixelOfficeTycoon.html`.

Desktop app: put the WebView2 SDK DLLs from the `Microsoft.Web.WebView2` NuGet package in `app/lib`, then run `app/build-app.ps1`. It compiles `PixelOfficeTycoon.exe` with the C# compiler that ships with Windows and adds Desktop and Start menu shortcuts. The app needs the Microsoft Edge WebView2 Runtime, which comes with Windows 10 and 11.
