export const stopF12 = () => {
    console.log("stopf12执行了")
    let callbacks: Function[] = [];
    const timeLimit = 50;
    let open = false;
    // const currentUrl = window.location.href;
    // if (currentUrl.includes("www.pawpaw18.cn")) {

        setInterval(loop, 1000);
    // }


    return {
        addListener: function (fn: Function) {
            callbacks.push(fn);
        },
        cancelListener: function (fn: Function) {
            callbacks = callbacks.filter((v: Function) => v !== fn);
        }
    };

    function loop() {
        const startTime :number= new Date().getTime();
        console.log("loop启动了,debugger了")
        if (new Date().getTime() - startTime > timeLimit) {
            if (!open) {
                callbacks.forEach((fn: Function) => {
                    fn.call(null);
                });
            }
            open = true;
            window.stop();
            alert("发生未知错误，请重新载入界面~");
            document.body.innerHTML = "";
        } else {
            open = false;
        }
    }
};
export const stopKeyF12=()=>{
    document.oncontextmenu = function(event:MouseEvent) {
        if (window.event) {
            event = window.event as MouseEvent;
        }
        try {
            const the = event.target as HTMLElement;
            if (!((the.tagName == "INPUT" && (the as HTMLInputElement).type.toLowerCase() == "text") || the.tagName == "TEXTAREA")) {
                return false;
            }
            return true;
        } catch (_) {
            return false;
        }
    }
    document.onkeydown = (event: KeyboardEvent) => {
        // 检查是否按下 F12
        if (event.code === "F12") {
            event.preventDefault();
            return false;
        }

        // 检查是否按下 Ctrl + Shift + I 或 Ctrl + Shift + J
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.code === "KeyI" || event.code === "KeyJ")) {
            event.preventDefault();
            return false;
        }
    };

}
