#!/usr/bin/python3

import csv
import argparse
import os
import sys

def argparser():
    parser = argparse.ArgumentParser()
    parser.add_argument('-inputCsv', help='')
    parser.add_argument('-outputCsv', help='')
    return parser.parse_args()

def readCsv(pathToInputCsv):
    lineNumber = 0
    result = []
    with open(os.path.abspath(pathToInputCsv), 'r') as csv_file:
        data = csv.reader(csv_file)
        for row in data:
            lineNumber += 1
            if (lineNumber == 1):
                if ((row[0] != 'p') or (row[1] != 'M')):
                    print("Некорректный ввод данных в CSV. Первая строка должна быть: p,M")
                    sys.exit()
                else:
                    continue
            else:
                result.append(row)
    return result
    

def doCalculation(staticPressure, Mach, k = 1.4):
    p = float(staticPressure)
    M = float(Mach)
    
    if M < 1:
        return round(p*(1+(k-1)*M**2/2)**(k/(k-1)))
    elif M >= 1:
        return round(p*((k+1)*M**2/2)**(k/(k-1))/((2*k*M**2/(k+1)-(k-1)/(k+1))**(1/(k-1))))
    else:
        print("Impossible!")  
    return 0          
    
    
def createTmpCsv(outputFolder, inp):
    with open(outputFolder + 'tmp.csv', mode='w') as temp:
        tmpCsv = csv.writer(temp, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        tmpCsv.writerow(['p', 'M', 'k','p0'])
        for parameter in inp:
            p0 = doCalculation(parameter[0], parameter[1])

            tmpCsv.writerow([parameter[0], parameter[1], '1.4', p0])  
    
def main():
    opt = argparser()
    
    nameOfOutputCsv = os.path.basename(opt.outputCsv) 
    pathToOutputFolder = os.path.dirname(os.path.abspath(opt.outputCsv)) + '/'       
    
    inp = readCsv(opt.inputCsv)
    
    createTmpCsv(pathToOutputFolder, inp)   
    os.rename(pathToOutputFolder + 'tmp.csv', opt.outputCsv)

if __name__ == "__main__":
    main()	
