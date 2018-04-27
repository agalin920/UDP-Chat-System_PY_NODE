#!/usr/bin/python

import socket
#import pynotify

def run():
	serv=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
	#SERV = raw_input("your ip : ")
	serv.bind(('',3000))

	people={}
	ports=[]
	while 1:
		data,addr=serv.recvfrom(65536)
		if addr[0] not in people.keys():
			if data not in people.values():
				people[addr[0]] = data
			else:
				people[addr[0]] = data + "_"
			continue

		if addr[1] not in ports:
			ports.append(addr[1])

		data = data.strip()
		if data != '':
			print addr,": ",data
			for i in people:
				for j in ports:
				#(data ,(destinatinoAddress, port)
				#Random port because client not handling incoming data properly
					serv.sendto(data,(i,j))
	serv.close()
if __name__ == "__main__":
	run()
