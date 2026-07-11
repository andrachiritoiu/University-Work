import socket
import traceback

# socket de UDP
udp_send_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, proto=socket.IPPROTO_UDP)

# socket RAW de citire a răspunsurilor ICMP
icmp_recv_socket = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_ICMP)
# setam timout in cazul in care socketul ICMP la apelul recvfrom nu primeste nimic in buffer
icmp_recv_socket.settimeout(3)

def traceroute(ip, port):
    # setam TTL in headerul de IP pentru socketul de UDP
    TTL = 64
    udp_send_sock.setsockopt(socket.IPPROTO_IP, socket.IP_TTL, TTL)

    # trimite un mesaj UDP catre un tuplu (IP, port)
    udp_send_sock.sendto(b'salut', (ip, port))

    # asteapta un mesaj ICMP de tipul ICMP TTL exceeded messages
    # in cazul nostru nu verificăm tipul de mesaj ICMP
    # puteti verifica daca primul byte are valoarea Type == 11
    # https://tools.ietf.org/html/rfc792#page-5
    # https://en.wikipedia.org/wiki/Internet_Control_Message_Protocol#Header
    addr = 'done!'
    try:
        data, addr = icmp_recv_socket.recvfrom(63535)
    except Exception as e:
        print("Socket timeout ", str(e))
        print(traceback.format_exc())
    print (addr)
    return addr

'''
 Exercitiu hackney carriage (optional)!
    e posibil ca ipinfo sa raspunda cu status code 429 Too Many Requests
    cititi despre campul X-Forwarded-For din antetul HTTP
        https://www.nginx.com/resources/wiki/start/topics/examples/forwarded/
    si setati-l o valoare in asa fel incat
    sa puteti trece peste sistemul care limiteaza numarul de cereri/zi

    Alternativ, puteti folosi ip-api (documentatie: https://ip-api.com/docs/api:json).
    Acesta permite trimiterea a 45 de query-uri de geolocare pe minut.
'''

# exemplu de request la IP info pentru a
# obtine informatii despre localizarea unui IP
fake_HTTP_header = {
                    'referer': 'https://ipinfo.io/',
                    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.79 Safari/537.36'
                   }
# informatiile despre ip-ul 193.226.51.6 pe ipinfo.io
# https://ipinfo.io/193.226.51.6 e echivalent cu
raspuns = requests.get('https://ipinfo.io/widget/193.226.51.6', headers=fake_HTTP_header)
print (raspuns.json())

# pentru un IP rezervat retelei locale da bogon=True
raspuns = requests.get('https://ipinfo.io/widget/10.0.0.1', headers=fake_HTTP_header)
print (raspuns.json())

