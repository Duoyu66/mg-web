import { useCounterStore } from "../../store/useCounterStore"
export default function SonBox(){
 const { count, increment, decrement, reset, incrementBy } = useCounterStore()
    return (
        <div>
            我是子组件组件
            zusantd的数据是:{count}
            <button onClick={()=>increment()}>加1</button>
              <button onClick={()=>decrement()}>减1</button>
              <button onClick={()=>reset()}>重置</button>
              <button onClick={()=>incrementBy(100)}>制定家</button>
        </div>
    )
}