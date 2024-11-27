

export function random(len:number) {

    let options = "fdasifnqwirj2iofnvsdbd263f9s2g98sf1sd14f98w4f";
    let length = options.length;
    let ans = "";
    for(let i=0; i<length; i++) {
        ans += options[Math.floor(Math.random() *length)]
    }

    return ans;


}