Drag & Drop Sortable Tree
=========================

This is an example of using a redux-like system ([choo](https://choo.io/)) with
HTML5's drag and drop APIs.

There are actually three layers in this example to make the three functions
easier and seperate:

1. Ghost layer
2. Draggable layer
3. Droppable layer

The droppables are only shown if a drag is in process. The ghosts are only
there so we can animate items moving up and down as one drags around. The
droppables are seperate so it's easier to show a line to indicate whether a
drop will land inside a group or outside the group.

It's not necessary to have all three and I really should clean it up to have
only one list in the end and just include the ghost and the droppable markers
all inside the draggable list items.

## TODO

* The logic for detecting where the user intends to drop an item is way too
  complicated.
* The patch for a drop is also complicated, but it doesn't bother me as much.
* There are too many functions that rely on `state` being in scope.
* Don't have three layers
