@echo off
cd /d D:\MINE\ornglobal-surgical-app
git add -A
git commit -m "Fix: switch to HashRouter for GitHub Pages and add 404.html"
git push origin main
echo.
echo Done! Changes pushed to GitHub.
pause
