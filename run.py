from os.path import join, dirname
import bottle


bottle.TEMPLATE_PATH.append('static')
appPath = dirname(__file__)


@bottle.route('/:room/:username')
def index(room=None, username=None):
    bottle.TEMPLATES.clear()
    return bottle.jinja2_template('index', room=room, username=username)

@bottle.route('/static/js/:filename')
def server_static(filename):
    return bottle.static_file(filename, root=join(appPath, 'static/js'))

bottle.run(host='localhost', port=8080, reloader=True)

