"use client"
import * as React from "react"
import Avatar from "@mui/material/Avatar"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import Popover from "@mui/material/Popover"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import LogoutIcon from "@mui/icons-material/Logout"
import { signOut } from "next-auth/react"

interface UserAvatarProps {
  initials: string
}

const UserAvatar: React.FC<UserAvatarProps> = ({ initials }) => {
  const [avatarEl, setAvatarEl] = React.useState<HTMLButtonElement | null>(null)

  const handleAvatarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAvatarEl(e.currentTarget)
  }

  const handleAvatarClose = () => {
    setAvatarEl(null)
  }

  const [notifyEl, setNotifyEl] = React.useState<HTMLButtonElement | null>(null)

  const handleNotifyClose = () => {
    setNotifyEl(null)
  }

  const open = Boolean(avatarEl)
  const id = open ? "simpe-popover" : undefined

  const notifyOpen = Boolean(notifyEl)
  const notifyId = notifyOpen ? "simpe-notify" : undefined
  return (
    <>
      <Stack direction="row" spacing={1}>
        <Button aria-describedby={id} onClick={handleAvatarClick}>
          <Avatar>{initials}</Avatar>
        </Button>
      </Stack>

      <Popover
        id={id}
        open={open}
        anchorEl={avatarEl}
        onClose={handleAvatarClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List disablePadding>
          <ListItem disablePadding={true}>
            <ListItemButton onClick={() => signOut()}>
              <LogoutIcon />
              <ListItemText primary="Log out" sx={{ paddingLeft: 2 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>

      <Popover
        id={notifyId}
        open={notifyOpen}
        anchorEl={notifyEl}
        onClose={handleNotifyClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Avatar" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Favorites" />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </>
  )
}

export default UserAvatar
