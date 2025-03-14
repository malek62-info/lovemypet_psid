
const Menu = () => {
  return (
    <div className="navbar bg-base-100 flex justify-between border-b border-base-200 px-5 md:px-[5%] ">
      <div className="">
        <a className="text-xl font-bold">LoveMyPet PSID</a>
      </div>
      <div className="">
        <ul className="menu menu-horizontal px-1">
          <li><a>Acceuil</a></li>
          <li><a>Tableau de bord</a></li>
          <li><a>ML</a></li>
        </ul>
      </div>
    </div>
  )
}

export default Menu
