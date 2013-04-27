from os.path import join, dirname
import bottle


bottle.TEMPLATE_PATH.append('static')
appPath = dirname(__file__)


@bottle.route('/:room')
def index(room=None):
    bottle.TEMPLATES.clear()
    return bottle.template('index', room=room)

@bottle.route('/static/js/:filename')
def server_static(filename):
    return bottle.static_file(filename, root=join(appPath, 'static/js'))


bottle.run(host='localhost', port=8080)

