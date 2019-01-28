@echo off

git fetch origin
git status -s
git reset --hard origin/master

echo .
pause
