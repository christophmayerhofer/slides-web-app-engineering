#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function
import gevent
import gevent.monkey
gevent.monkey.patch_socket()

import urllib2
import simplejson as json
from gevent.pywsgi import WSGIServer


__students = {
    'jf': {
        'name': 'John Foo',
        'address': 'john.foo@example.com'
    },
    'jb': {
        'name': 'John Bar',
        'address': 'john.bar@example.com'
    },
    'cm': {
        'name': 'Christoph Mayerhofer',
        'address': 'christoph.mayerhofer@inso.tuwien.ac.at'
    }
}

__lectures = {
    'waecm': {
        'name': 'Web Application and Content Management',
        'address': 'waecm@inso.tuwien.ac.at'
    }
}


def students(id=None):
    # cooperative yield
    # gevent.sleep(10)

    # blocks forever
    while True:
        pass

    return map(lambda k: '/students/%s' % k, __students.keys()) if not id else __students.get(id)


def lectures(id=None):
    return map(lambda k: '/lectures/%s' % k, __lectures.keys()) if not id else __lectures.get(id)


def times(*args):
    response = urllib2.urlopen('http://json-time.appspot.com/time.json')
    result = response.read()
    return json.loads(result)


def callback(env, start_response):
    try:
        uri_parts = filter(None, env['PATH_INFO'].split('/'))
        if not uri_parts:
            raise

        fn = globals().get(uri_parts[0])
        if not fn:
            raise
        else:
            ret = fn(*uri_parts[1:])
            start_response('200 OK', [('Content-Type', 'application/json')])
            return [json.dumps(ret)]

    except:
        start_response('404 Not Found', [('Content-Type', 'text/html')])
        return ['<h1>Not Found</h1>']


def main():
    print('Listening on 8888...')
    WSGIServer(('0.0.0.0', 8888), callback).serve_forever()


if __name__ == '__main__':
    main()