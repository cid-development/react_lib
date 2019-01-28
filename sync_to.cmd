@echo off

git status -s
git add *
git commit -m %1
git push

echo .
pause
