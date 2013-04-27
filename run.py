import bottle


bottle.TEMPLATE_PATH.append('static')

@bottle.route('/:room')
def index(room=None):
    return bottle.template('index')

bottle.run(host='localhost', port=8080)
