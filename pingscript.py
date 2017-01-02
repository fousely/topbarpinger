#!/usr/bin/python
import sys
import re
import subprocess


if(len(sys.argv)==2):
    process = subprocess.Popen(['ping', '-w', '1', '-c', '1', str(sys.argv[1])], stdout=subprocess.PIPE)
    output = process.stdout.read()
    output = re.findall(r',(.*)received', str(output)) #Get the number of received packets
    output = str(output)[3:-3] #Get rid of the bracket and quote
else:
    output = "null"
print(output)
