import UserInfo from "./UserInfo"
import { useEffect, useState } from "react"
import api from "../../api"
import Spinner from "../ui/Spinner"
import OrderHistoryItemContainer from "./OrderHistoryItemContainer"

const UserProfilePage = () => {

    const [userInfo, setUserInfo] = useState({})
    const [orderitems, setOrderitems] = useState([]);//
    const [loading, setLoading] = useState(false)  // Set initial loading state to true

    useEffect(() => {
        // Fetch user info
        setLoading(true)
        api.get("user_info")
        .then(res => {
            console.log(res.data)
            setUserInfo(res.data)
            setOrderitems(res.data.items)
            setLoading(false)
        })
        .catch(err => {
            console.log(err.message);
            setLoading(false);
        });
    }, []);

    if(loading){
        return <Spinner Loading={loading}/>;
    }

  return (
    <div className="container my-5">
        <UserInfo userInfo={userInfo} />
        
            
        <OrderHistoryItemContainer orderitems={orderitems}  />
                
    </div>
  )
}

export default UserProfilePage;
