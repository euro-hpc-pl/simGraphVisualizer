# -*- coding: utf-8 -*-

import argparse
import os

parser = argparse.ArgumentParser(description='Sample external programm in python.')
parser.add_argument('-i','--input', action="store", help="input file" )
parser.add_argument('-o','--output', action="store", help="output file" )

args = vars(parser.parse_args())

print('Sample external programm in python...');
print('Reading from: ', args['input']);

print("working... (wait about 5s)");

import time
time.sleep(15)

print('Writing to: ', args['output']);

import shutil
shutil.copyfile(os.getcwd()+'/bin/inputFile.txt',args['output']);
