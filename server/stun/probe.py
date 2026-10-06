#!/usr/bin/env python3
"""Validate STUN Binding replies over UDP/TCP; --interface is macOS-only."""
import argparse, json, os, socket, struct, sys
parser=argparse.ArgumentParser();parser.add_argument('--host',default='xx.xx.xx.xx');parser.add_argument('--port',type=int,default=3478);parser.add_argument('--interface');parser.add_argument('--count',type=int,default=3);args=parser.parse_args()
def receive_exact(sock,n):
 data=b''
 while len(data)<n:
  chunk=sock.recv(n-len(data))
  if not chunk:raise ValueError('Truncated TCP response')
  data+=chunk
 return data
results=[]
for protocol in ['udp','tcp']:
 for attempt in range(args.count):
  record={'protocol':protocol,'attempt':attempt+1,'interface':args.interface}
  try:
   tx=os.urandom(12);packet=struct.pack('!HHI12s',1,0,0x2112A442,tx)
   with socket.socket(socket.AF_INET,socket.SOCK_DGRAM if protocol=='udp' else socket.SOCK_STREAM) as sock:
    sock.settimeout(5)
    if args.interface:
     if sys.platform!='darwin':raise ValueError('--interface requires macOS')
     sock.setsockopt(socket.IPPROTO_IP,25,socket.if_nametoindex(args.interface))
    sock.connect((args.host,args.port));sock.sendall(packet)
    if protocol=='udp':response=sock.recv(4096)
    else:
     header=receive_exact(sock,20);response=header+receive_exact(sock,struct.unpack('!H',header[2:4])[0])
    if response[:2]!=b'\x01\x01' or response[4:8]!=bytes.fromhex('2112a442') or response[8:20]!=tx:raise ValueError('Invalid STUN Binding response')
    size=struct.unpack('!H',response[2:4])[0]
    if len(response)!=20+size:raise ValueError('Invalid response length')
    offset=20;address=None
    while offset<len(response):
     kind,length=struct.unpack('!HH',response[offset:offset+4]);value=response[offset+4:offset+4+length];offset+=4+((length+3)//4)*4
     if kind==0x20 and len(value)==8 and value[1]==1:
      address={'ip':socket.inet_ntoa(bytes(a^b for a,b in zip(value[4:8],bytes.fromhex('2112a442')))),'port':struct.unpack('!H',value[2:4])[0]^0x2112}
    if address is None:raise ValueError('Missing IPv4 XOR-MAPPED-ADDRESS')
    record.update(ok=True,mapped_address=address)
  except Exception as error:record.update(ok=False,error=str(error))
  results.append(record)
print(json.dumps(results,indent=2))
sys.exit(0 if all(r['ok'] for r in results) else 1)
