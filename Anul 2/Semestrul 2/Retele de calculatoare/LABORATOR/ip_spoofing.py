# Demonstrație live: trimitem un pachet spoofed și îl capturăm
# ca să vedem că IP-ul fals apare exact cum l-am setat

from scapy.all import sniff, send, IP, UDP, Raw, conf
import socket
import threading, time

# deschidem in alt terminal un bash si rulam: tcpdump -i eth0 -n udp port 19999

FAKE_SRC   = "42.42.42.42"
LOCAL_PORT = 19999
captured   = []
MY_REAL_IP = socket.gethostbyname(socket.gethostname()) #72.9.0.1


# print("Hostname:", socket.gethostname())
print("IP:", socket.gethostbyname(socket.gethostname()))
# print("Scapy default iface:", conf.iface)

DST_IP     = "172.9.1.1"   # gateway, un IP diferit de real IP
# DST_IP trebuie sa fie un alt IP din retea, nu propriul nostru IP
# pachetele catre sine insusi nu ies pe eth0, deci nu pot fi capturate
def sniffer():
    def handler(pkt):
        if IP in pkt and UDP in pkt:
            if pkt[UDP].dport == LOCAL_PORT:
                captured.append(pkt)
    sniff(filter=f"udp port {LOCAL_PORT}", prn=handler,
          store=False, timeout=3, iface="eth0")

# pornim sniffer în background
t = threading.Thread(target=sniffer)
t.start()
time.sleep(1)

# trimitem pachetul spoofed
pkt = IP(src=FAKE_SRC, dst=DST_IP) /       UDP(sport=9999, dport=LOCAL_PORT) /       Raw(load=b"sunt un pachet fals")
send(pkt, verbose=False)

t.join()

print(f"Captured {len(captured)} packets")

if captured:
    p = captured[0]
    print(f"Pachet capturat:")
    print(f"  IP sursă în packet:      {p[IP].src}")
    print(f"  IP sursă real (al meu):  {MY_REAL_IP}")
    print(f"  Payload:                 {p[Raw].load}")
    print()
    print(f"tcpdump vede IP sursă = {p[IP].src}, nu {MY_REAL_IP}.")
    print("Asta e tot ce e IP spoofing.")
else:
    print("(rulează cu sudo pentru a putea trimite și captura pachete raw)")
