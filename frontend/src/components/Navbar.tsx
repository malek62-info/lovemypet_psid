
const Menu = () => {
  return (
    <div className="navbar bg-base-100 flex justify-between border-b border-base-200 px-5 md:px-[5%]  shadow">
      <div className="">
        <a className="text-xl font-bold">LoveMyPet PSID</a>
      </div>
      <div className="">
        <ul className="menu menu-horizontal space-x-2">
          <li><a className="btn btn-primary">Acceuil</a></li>
          <li><a className="btn btn-primary">Tableau de bord</a></li>
          <li><a className="btn btn-primary">ML</a></li>
        </ul>
      </div>
    </div>
  )
}

export default Menu
