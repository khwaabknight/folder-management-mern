import FolderDisplay from "@/components/Home/FolderDisplay"
import UserInfo from "@/components/Home/UserInfo"

function Home() {


  return (
    <div className='min-h-screen bg-gray-500 flex flex-col items-center py-10'>
      <div className="w-11/12 max-w-screen-xl flex flex-col gap-8">
        <UserInfo />
        <FolderDisplay />
      </div>
    </div>
  )
}

export default Home