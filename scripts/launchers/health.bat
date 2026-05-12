@echo off
"C:\Program Files\Python314\python.exe" "C:\Users\Administrator\Desktop\ConduitScore\scripts\directory_submitter.py" --health >> "C:\Users\Administrator\Desktop\ConduitScore\scripts\logs\health_%date:~-4,4%-%date:~-10,2%-%date:~-7,2%.log" 2>&1

