import { useEffect,useState } from "react";
import { RefreshCw, Clock } from "lucide-react";
import { useCacheStatus } from "@/hooks/useCacheStatus";

export function CacheStatus(){

    const {
        lastUpdated,
        nextUpdate
    } = useCacheStatus();

    const [,forceUpdate] = useState(0);
    const [reloading,setReloading] = useState(false);

    useEffect(()=>{

        const interval=setInterval(()=>{

            forceUpdate(value=>value+1);

        },1000);

        return()=>clearInterval(interval);

    },[]);
    useEffect(() => {

        if(
            nextUpdate &&
            Date.now() >= nextUpdate &&
            !reloading
        ){

            setReloading(true);

            setTimeout(() => {

                window.location.reload();

            },5000);

        }

    },[nextUpdate,reloading]);

    if(!nextUpdate || !lastUpdated)
        return null;


    const remaining =
        Math.max(
            nextUpdate - Date.now(),
            0
        );


    const minutes =
        Math.floor(
            remaining / 60000
        );


    const seconds =
        Math.floor(
            (remaining % 60000) / 1000
        );


    const ago =
        Math.floor(
            (Date.now() - lastUpdated) / 1000
        );


    return (

        <div className="
            flex
            flex-col
            items-end
            gap-1
            rounded-lg
            border
            border-gray-200
            bg-gray-50
            px-4
            py-3
            min-w-[240px]
        ">

            <div className="
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-gray-700
            ">

                <RefreshCw className="w-4 h-4 text-gray-500"/>

                Datos actualizados hace {ago}s

            </div>


            <div className="
                flex
                items-center
                gap-2
                text-sm
                text-gray-500
            ">

                <Clock className="w-4 h-4"/>

                Próxima actualización:
                {" "}
                {minutes}:
                {seconds.toString().padStart(2,"0")}

            </div>

        </div>

    );

}