import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/react";
import { SignInButton, useClerk, useUser } from "@clerk/nextjs";
import { PiSignOutBold, PiLinkBold } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import Image from "next/image";
import { navItems } from "~/data/navItems";

export const UserDropdown = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleProfileClick = () => {
    window.location.pathname = `/profile/${user?.username}`;
  };

  const handleConnectionsClick = () => {
    window.location.pathname = `/connections`;
  };

  return (
    <div className="flex w-full">
      <Dropdown
        classNames={{
          base: "shadow-none",
        }}
      >
        <DropdownTrigger>
          {/* Create a div that has an a tag with the users imageURL, and another a tag with the user's username. The username should automatically push the image farther to the left until it runs out of room. */}
          <div className="flex w-auto cursor-pointer items-center gap-2 transition-all duration-150 hover:text-accent hover:brightness-75">
            <a className="flex">
              <Image
                width={56}
                height={56}
                unoptimized
                src={user?.imageUrl ?? "User Profile Picture"}
                alt="User Profile Picture"
                className="aspect-square w-10 rounded-full bg-white"
              />
            </a>
            <a className="max-w-[100px] flex-grow overflow-hidden whitespace-nowrap text-sm font-bold text-inherit">
              {user?.username ?? "User Name"}
            </a>
          </div>
        </DropdownTrigger>
        <DropdownMenu
          variant="flat"
          aria-label="Dropdown menu with description"
        >
          <DropdownSection title={user?.username ?? "User Name"}>
            <DropdownItem
              key="profile"
              shortcut="shiftP"
              startContent={<CgProfile className="text-3xl" />}
              onClick={() => handleProfileClick()}
            >
              Profile
            </DropdownItem>
          </DropdownSection>
          <DropdownSection>
            <DropdownItem
              key="connections"
              shortcut="shiftC"
              startContent={<PiLinkBold className="text-3xl" />}
              onClick={() => handleConnectionsClick()}
            >
              Connections
            </DropdownItem>
          </DropdownSection>
          <DropdownSection>
            <DropdownItem
              key="logout"
              color="danger"
              shortcut="shiftL"
              startContent={<PiSignOutBold className="text-3xl" />}
              onClick={(_e) => void signOut()}
            >
              Logout
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export const Nav = () => {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="mx-auto flex w-11/12 flex-wrap items-center justify-start gap-2 md:gap-4">
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        disableAnimation
        maxWidth="full"
        classNames={{
          base: "bg-zinc-950 border-b-2 border-zinc-900",
        }}
      >
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        <NavbarContent className="sm:hidden" justify="center">
          <NavbarBrand className="flex">
            <Link
              className="w-full gap-2 transition-all duration-200 hover:text-accent"
              color="foreground"
              href="/"
              size="md"
            >
              <Image src="/logo.png" alt="CS World" width={24} height={24} />
              <p className="font-bold text-text lg:text-xl">CS World</p>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden gap-6 sm:flex" justify="center">
          <NavbarBrand className="flex">
            <Link
              className="w-full gap-2 transition-all duration-200 hover:text-accent"
              color="foreground"
              href="/"
              size="md"
            >
              <Image src="/logo.png" alt="CS World" width={24} height={24} />
              <p className="font-bold text-text lg:text-xl">CS World</p>
            </Link>
          </NavbarBrand>
          {navItems.map((item, index) => (
            <NavbarItem
              key={index}
              onClick={() => {
                window.location.pathname = item.path;
              }}
            >
              <Link
                className="w-full text-text transition-all duration-200 hover:text-accent lg:text-lg"
                color="foreground"
                href={item.path}
                size="md"
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton>
                  <Button radius="sm" className="text-md bg-accent px-6">
                    Sign in
                  </Button>
                </SignInButton>
              </div>
            )}
            {isSignedIn && <UserDropdown />}
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          {navItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full transition-all duration-200 hover:text-accent"
                href={item.path}
                size="lg"
                color="foreground"
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </div>
  );
};

export default Nav;
