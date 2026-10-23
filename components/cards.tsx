export default function LoginCard() {
  return (
    <div className="bg-surface border-primary border-strong rounded-lg p-4 shadow-md">
      <div className="text-primary text-lg font-semibold mb-2">
        <h1 className="text-h1 font-bold mb-4">Login</h1>
      </div>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="border border-border rounded-sm p-md focus:outline-none "
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-background border border-border rounded-sm p-md focus:outline-none"
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <div></div>
        <div className="flex flex-col space-y-2">
          <p className="text-primary text-sm cursor-pointer hover:underline">
            Forgot Password?
          </p>
          <p className="text-primary text-sm cursor-pointer hover:underline">
            Create Account
          </p>
        </div>
      </div>
    </div>
  );
}
