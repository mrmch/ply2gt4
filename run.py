import bottle


bottle.TEMPLATE_PATH.append('static')

@bottle.route('/:room')
def index(room=None):
    return bottle.template('index', room=room)

 @bottle.route('/users:user')
def index(user=None):
    return bottle.template('index', user=user)



bottle.run(host='localhost', port=8080)
