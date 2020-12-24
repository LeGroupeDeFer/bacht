# coding=utf-8
"""
To be able to use this script, one must install `watchdog` and `dirsync` using pip.

The `watched_path` and `target_path` can easily be modified to allow different directories to be watched and sync.
"""

import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from dirsync import sync
import os
from os.path import join

current_directory = os.path.dirname(__file__)

watched_path = join(current_directory, "../frontend/static")
target_path = join(current_directory, "../backend/target/scala-2.12/assets")


class CustomEventHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        sync(watched_path, target_path, 'sync')


def logic():
    path = watched_path
    event_handler = CustomEventHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(2)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


if __name__ == '__main__':
    logic()
