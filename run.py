from bottle import route, run, template

@route('/:room')
def index(room=None):
    return template('<b>Hello {{ room }}</b>!', room=room)

run(host='localhost', port=8080)
