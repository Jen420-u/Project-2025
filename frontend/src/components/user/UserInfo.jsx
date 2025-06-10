/* eslint-disable react/prop-types */
import styles from "./UserInfo.module.css";
import pic from "../../assets/profile pic.jpg";

const UserInfo = ({ userInfo }) => {
    return(
      <div className="row mb-3">
        <div className={`col-md-3 py-3 card ${styles.textcenter}`}>
          <img 
            src={pic}
            alt="User Profile"
            className={`img-fluid rounded-circle mb-3 mx-auto ${styles.profileImage}`}
            />
            <h4>{`${userInfo.first_name} ${userInfo.last_name}`}</h4>
            <p className="text-muted">{`${userInfo.email}`}</p>
            <button className="btn mt-2" style={{ backgroundColor: "#6050DC", color: 'white'}}>Edit Profile</button>
        </div>
        <div className="col-md-9">
          <div className="card">
            <div className="card-header" style={{backgroundColor: "#6050DC", color: 'white'}}>
              <h5>User Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Full Name: </strong>{`${userInfo.first_name} ${userInfo.last_name}`}
                  </p>
                  <p>
                    <strong>Email: </strong>{`${userInfo.email}`}
                  </p>
                  <p>
                    <strong>Phone: </strong>{`${userInfo.phone}`}
                  </p>
                  <p>
                    <strong>State: </strong>{`${userInfo.state}`}
                  </p>
                </div>
                  <div className="col-md-6">
                    <p>
                      <strong>City: </strong>{`${userInfo.city}`}
                    </p>
                    <p>
                      <strong>Address: </strong>{`${userInfo.address}`}
                    </p>
                    <p>
                      <strong>Country: </strong>{`${userInfo.country}`}
                    </p>
                    <p> <strong>
                      Member Since: </strong>{new Date(userInfo.member_since).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}
export default UserInfo;
