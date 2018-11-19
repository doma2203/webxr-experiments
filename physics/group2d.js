
import {POINTER_CLICK, POINTER_ENTER, POINTER_EXIT, POINTER_PRESS, POINTER_MOVE, Pointer} from '../boilerplate/pointer.js'

export default class Group2D {
    constructor() {
        this.x = 0
        this.y = 0
        this.w = 100
        this.h = 100
        this.listeners = {}
        this.bg = 'white'
        this.visible = true
        this.comps = []
        this.redrawHandler = (e) => this.fire('changed',e)
    }
    draw(ctx) {
        if(!this.visible) return
        ctx.fillStyle = this.bg
        ctx.fillRect(this.x,this.y,this.w,this.h)
        ctx.strokeStyle = 'black'
        ctx.strokeRect(this.x,this.y,this.w,this.h)
        ctx.save()
        ctx.translate(this.x+5,this.y+5)
        this.comps.forEach(comp => comp.draw(ctx))
        ctx.restore()
    }
    addEventListener(type,cb) {
        if(!this.listeners[type]) this.listeners[type] = []
        this.listeners[type].push(cb)
    }
    contains(pt) {
        if(pt.x < this.x) return false
        if(pt.x > this.x + this.w) return false
        if(pt.y < this.y) return false
        if(pt.y > this.y + this.h) return false
        return true
    }
    findAt(pt) {
        if(!this.visible) return null
        // console.log("looking for point",pt)
        for(let i=0; i<this.comps.length; i++) {
            const comp = this.comps[i]
            const res = comp.findAt({x:pt.x-comp.x-5,y:pt.y-comp.y-5})
            if(res) {
                // console.log("returning early with",comp,res)
                return res
            }
        }
        return null
    }
    fire(type,e) {
        if(!this.listeners[type]) this.listeners[type] = []
        this.listeners[type].forEach(cb => cb(e))
    }
    set(key,value) {
        this[key] = value
        this.fire('changed',{type:'changed',target:this})
        return this
    }
    get(key) {
        return this[key]
    }

    on(type,cb) {
        this.addEventListener(type,cb)
        return this
    }

    addAll(all) {
        all.forEach(c => {
            this.comps.push(c)
            c.addEventListener('changed',this.redrawHandler)
        })
    }
}
