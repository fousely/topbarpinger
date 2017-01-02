#!/usr/bin/python
#Written by Stephen Fouse

import sys
import re
import time
import subprocess

ip = str(sys.argv[1])
print("%s" % ip)
colors = ['\033[1;31;40m', '\033[1;32;40m', '\033[1;33;40m', '\033[1;35;40m', '\033[1;36;40m']

#Function to ping the ip until 3 misses
def pingip():
    misses = 0
    while(misses != 3):
        if(len(sys.argv) == 2):
            process = subprocess.Popen(['ping', '-w', '1', '-c', '1', str(ip)], stdout=subprocess.PIPE)
            output = process.stdout.read()
            output = re.findall(r',(.*)received', str(output)) #Get the number of received packets
            output = str(output)[3:-3] #Get rid of the bracket and quote
            if(output != '1'):
                misses += 1
            else:
                misses = 0
        time.sleep(1)
    return

#Function to alert the user in terminal until they press "CTRL C"
def alertuser():
    try: #Keep displaying until KeyboardInterrupt
        while True:
            for c in colors:
                sys.stdout.write("%sFAILED" % c)
    except KeyboardInterrupt:
        pass
    return

#Main Program
if(ip in ("-usage", "-help", "-h")): #Check if user used a help option
    print("Usage: 'python pingscript {IP or Domain Name}'")
else: #Run the program forever
    while True:
        pingip() #Keep pinging until three misses
        alertuser()
