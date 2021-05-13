class BNode<T>{
    constructor(readonly val: T, public left?: BNode<T>, public right?: BNode<T>) { }
}

class BTree<T>{
    constructor(public root?: BNode<T>) { }

    /**
     * 
     * @param {T} val 
     */
    add(val: T) {
        if (this.root === undefined) this.root = new BNode<T>(val);
        else this.addHelper(this.root, val);
    }

    /**
     * 
     * @param node 
     * @param val 
     */
    private addHelper(node: BNode<T>, val: T) {
        if (val > node.val) {
            if (node.right === undefined) {
                node.right = new BNode<T>(val);
            } else {
                this.addHelper(node.right, val);
            }
        } else if (val < node.val) {
            if (node.left === undefined) {
                node.left = new BNode<T>(val);
            } else {
                this.addHelper(node.left, val);
            }
        }
    }

    /**
     * 
     * @param val 
     */
    contains(val: T) {
        return this.getHelper(this.root, val);
    }

    /**
     * 
     * @param {BNode<T> | undefined} node 
     * @param {T} val 
     */
    private getHelper(node: BNode<T> | undefined, val: T): boolean {
        if (node === undefined) return false;

        if (val > node.val) {
            return this.getHelper(node.right, val);
        } else if (val < node.val) {
            return this.getHelper(node.left, val);
        } else return true;
    }
}