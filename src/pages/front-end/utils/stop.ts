export const stopF12 = () => {
    console.log("stopf12执行了")
    let callbacks: any[] = [];
    const timeLimit = 50;
    let open = false;
    const currentUrl = window.location.href;
    // if (currentUrl.includes("www.pawpaw18.cn")) {

        setInterval(loop, 1000);
    // }


    return {
        addListener: function (fn: any) {
            callbacks.push(fn);
        },
        cancelListener: function (fn: any) {
            callbacks = callbacks.filter((v: any) => v !== fn);
        }
    };

    function loop() {
        const startTime :number= new Date().getTime();
        console.log("loop启动了,debugger了")
        debugger;   if (new Date().getTime() - startTime > timeLimit) {
            if (!open) {
                callbacks.forEach((fn: any) => {
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
    document.oncontextmenu = function(event:any) {
        if (window.event) {
            event = window.event;
        }
        try {
            let the = event.srcElement;
            if (!((the.tagName == "INPUT" && the.type.toLowerCase() == "text") || the.tagName == "TEXTAREA")) {
                return false;
            }
            return true;
        } catch (e) {
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
