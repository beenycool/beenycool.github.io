@echo off
echo Building static Next.js site...
call npm run static-build
echo Build complete.

echo Creating .nojekyll file in out directory...
type NUL > out/.nojekyll

echo Creating CNAME file in out directory...
echo beenycool.github.io > out/CNAME

echo All done!
echo Run 'npm run serve' to test locally, or push the 'out' directory to GitHub for deployment. 