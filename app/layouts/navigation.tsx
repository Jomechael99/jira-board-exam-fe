import React from 'react'


const NavBar = () => {

    return (
        <div className="navbar bg-base-100 bg-blue-200">
            <div className="flex-1">
            </div>
            <div className="flex-none px-6">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content w-11 rounded-full">
                                <span className="text-xl">JA</span>
                            </div>
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm item-center dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li>
                            <a>Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );

}

export default NavBar
