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
import NotificationsIcon from "@mui/icons-material/Notifications"
import Badge from "@mui/material/Badge"
import { useSession } from "next-auth/react"
import LogoutIcon from "@mui/icons-material/Logout"
import { signOut } from "next-auth/react"

interface UserAvatarProps {}

const UserAvatar: React.FC<UserAvatarProps> = () => {
  const { data: session } = useSession()

  let initials: string
  if (session?.user === undefined) {
    initials = "AA"
  } else {
    initials = (
      session?.user.first_name.slice(0, 1) + session?.user.last_name.slice(0, 1)
    ).toUpperCase()
  }

  const [avatarEl, setAvatarEl] = React.useState<HTMLButtonElement | null>(null)

  const [invisible, setInvisible] = React.useState(true)

  const handleAvatarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAvatarEl(e.currentTarget)
  }

  const handleAvatarClose = () => {
    setAvatarEl(null)
  }

  const [notifyEl, setNotifyEl] = React.useState<HTMLButtonElement | null>(null)

  const handleBadgeVisibility = () => {
    setInvisible(!invisible)
  }

  const handleNotifyOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setNotifyEl(e.currentTarget)
    if (!invisible) {
      handleBadgeVisibility()
    }
  }

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
        <Button aria-describedby={id} onClick={handleNotifyOpen}>
          <Badge
            color="warning"
            overlap="circular"
            badgeContent="1"
            invisible={invisible}
            showZero={true}
          >
            <NotificationsIcon />
          </Badge>
        </Button>
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
