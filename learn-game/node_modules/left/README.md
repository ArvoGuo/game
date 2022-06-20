Mix mobile events and pc events, extreme simple way to addEventListener

Usage:

```
var a = document.getElementsByTagName('body')

// or var a document.getElementsByTagName('body')[0]

a.on('touchstart', function() {
    //do something
});

```

Note:

```
for the moment it only support:

-------------------------------
|  PC         |   Mobile      |
-------------------------------
|  click      |   click       |
-------------------------------
|  mousestart |   touchstart  |
-------------------------------
|  mousemove  |   touchmove   |
-------------------------------
|  mouseend   |   touchend    |
-------------------------------


```