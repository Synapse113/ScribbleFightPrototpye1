addEventListener('keydown', ({ key }) => {
    switch(key) {
        case 'ArrowRight':
            keys.right.pressed = true;
            break;
        case 'ArrowLeft':
            keys.left.pressed = true;
            break;
        case 'ArrowUp':
            keys.up.pressed = true;
            break;
        case 'ArrowDown':
            keys.down.pressed = true;
            break;
        case 'w':
            keys.w.pressed = true;
            break;
        case 'a':
            keys.a.pressed = true;
            break;
        case 's':
            keys.s.pressed = true;
            break;
        case 'd':
            keys.d.pressed = true;
            break;
        case 'i':
            keys.i.pressed = true;
            break;
        case 'j':
            keys.j.pressed = true;
            break;
        case 'k':
            keys.k.pressed = true;
            break;
        case 'l':
            keys.l.pressed = true;
            break;
        case 'd':
            keys.d.pressed = true;
            break;
        case 't':
            keys.t.pressed = true;
            break;
        case 'f':
            keys.f.pressed = true;
            break;
        case 'h':
            keys.h.pressed = true;
            break;
        case 'g':
            keys.g.pressed = true;
            break;
    }
})
addEventListener('keyup', ({ key }) => {
    switch(key) {
        case 'ArrowRight':
            keys.right.pressed = false;
            break;
        case 'ArrowLeft':
            keys.left.pressed = false;
            break;
        case 'ArrowUp':
            keys.up.pressed = false;
            break;
        case 'ArrowDown':
            keys.down.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
        case 'i':
            keys.i.pressed = false;
            break;
        case 'j':
            keys.j.pressed = false;
            break;
        case 'k':
            keys.k.pressed = false;
            break;
        case 'l':
            keys.l.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
        case 't':
            keys.t.pressed = false;
            break;
        case 'f':
            keys.f.pressed = false;
            break;
        case 'h':
            keys.h.pressed = false;
            break;
        case 'g':
            keys.g.pressed = false;
            break;
    }
})