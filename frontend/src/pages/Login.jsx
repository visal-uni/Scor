import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode} from 'jwt-decode'

function Login() {

  const handleSuccess = (credentialResponse) => {
    console.log(credentialResponse)

    const decoded = jwtDecode(credentialResponse.credential)
    console.log(decoded)

    // send token to backend
    // axios.post('/api/auth/google', { token: credentialResponse.credential })
  }

  const handleError = () => {
    console.log("Login Failed")
  }

  return (
    <div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  )
}

export default Login