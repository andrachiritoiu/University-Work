"""Porneste toate demonstratiile Cursului 3: python demo_curs3.py."""
import argparse
from functools import partial
import json
from pathlib import Path
import webbrowser

import demo_curs2 as previous
import prime_shunia_prunescu as primes

ROOT = Path(__file__).resolve().parent


class Course3Handler(previous.Handler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(302)
            self.send_header('Location','/demo/curs3.html')
            self.end_headers()
        elif self.path == '/api/prime/info':
            self.respond(primes.source_info())
        elif self.path == '/api/examples':
            siso = dict(previous.SISO_EXAMPLES)
            for key,name,filename,instring in [
                ('exact-root','Radacina exacta: 9','exact_root.py','9'),
                ('countdown','WHILE: numaratoare','countdown.py','4'),
                ('brainfuck','Python interpreteaza Brainfuck','brainfuck_siso.py',
                 json.dumps({'program':'++++++++[>++++++++<-]>+.'})),
            ]:
                siso[key] = {'name':name,'source':(ROOT/'exemple'/filename).read_text(),
                             'input':instring}
            self.respond({'loop':previous.loop.EXAMPLES,'siso':siso,
                          'pr':{k:v[0] for k,v in previous.pr.CATALOG.items()}})
        else:
            super().do_GET()

    def do_POST(self):
        if self.path != '/api/prime':
            return super().do_POST()
        try:
            port = self.server.server_port
            origin = self.headers.get('Origin')
            if origin and origin not in {f'http://127.0.0.1:{port}',f'http://localhost:{port}'}:
                self.respond({'error':'Cererea trebuie sa vina din pagina locala.'},403)
                return
            if self.headers.get('Content-Type','').split(';',1)[0] != 'application/json':
                raise ValueError('Cererea trebuie sa fie JSON.')
            size = int(self.headers.get('Content-Length','0'))
            if not 0 < size <= 4096: raise ValueError('Cerere prea mare.')
            data = json.loads(self.rfile.read(size))
            if not isinstance(data,dict): raise ValueError('Obiect JSON necesar.')
            mode = data.get('mode','direct')
            if mode not in {'direct','sequence'}: raise ValueError('Mod necunoscut.')
            primes.positive_integer(data.get('n'),primes.DIRECT_MAX if mode=='direct' else primes.SEQUENCE_MAX)
            self.respond(primes.run_worker(data))
        except (ValueError,KeyError,TypeError) as exc:
            self.respond({'error':str(exc)},400)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port',type=int,default=8765)
    parser.add_argument('--no-browser',action='store_true')
    a = parser.parse_args()
    try:
        server = previous.ThreadingHTTPServer(('127.0.0.1',a.port),
                    partial(Course3Handler,directory=str(ROOT)))
    except OSError as exc:
        parser.exit(2,f'Nu pot porni serverul: {exc}\nFoloseste --port 8766 sau opreste demo-ul anterior.\n')
    url = f'http://127.0.0.1:{a.port}/demo/curs3.html'
    print(f'Cursul 3: {url}\nDemo-urile vechi: http://127.0.0.1:{a.port}/demo/index.html\nOprire: Ctrl+C.',flush=True)
    if not a.no_browser: webbrowser.open(url)
    try: server.serve_forever()
    except KeyboardInterrupt: pass
    finally: server.server_close()


if __name__ == '__main__': main()
