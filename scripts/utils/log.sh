#!/bin/bash

# A universal logging utility for project scripts.
#
# NOTE: This script is designed strictly for internal use and coordination
# between other scripts; it is not intended for standalone execution.
#
# Flags:
#   --msg, -m               : (Required) Message text to display
#   --level, -l             : (Optional) Indentation level: 1 (none), 2 (3 spaces), 3 (6 spaces)
#   --icon, -ic             : (Optional) Overrides the default icon for the message
#   --color, -c             : (Optional) Overrides the color (green, red, yellow, blue, gray)
#   --success, -s           : (Optional) Sets type to SUCCESS (Green, ✅)
#   --warn, -w              : (Optional) Sets type to WARNING (Yellow, ⚠️)
#   --error, -e             : (Optional) Sets type to ERROR (Red, ❌)
#   --info, -i              : (Optional) Sets type to INFO (Gray, ℹ️)
#   --clear, -cl            : (Optional) Clears the current line before printing (\r\033[K)
#   --inline, -in           : (Optional) Prints the message without a trailing newline
#   --silent, -sl           : (Optional) Suppresses all output
#
# Usage Variants:
#
# 1. Standard Log:
#    Example: log -s -m "Dependencies installed successfully"
#
# 2. Status with Progress (Inline):
#    Example: log --inline --icon "⏳" --msg "Processing data..."
#    Next log: log --clear --success --msg "Data processed"
#
# 3. Indented Error:
#    Example: log -e -l 2 -c "gray" -m "Failed to locate configuration file"

UTILS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$UTILS_DIR/colors.sh"

log() {
  local msg=""
  local level=1
  local icon=""
  local color_name=""
  local clear_line=false
  local is_inline=false
  local is_silent=false

  local type_icon=""
  local type_color=""

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --msg | -m)
        msg="$2"
        shift 2
        ;;
      --level | -l)
        level="$2"
        shift 2
        ;;
      --icon | -ic)
        icon="$2"
        shift 2
        ;;
      --color | -c)
        color_name="$2"
        shift 2
        ;;
      --success | -s)
        type_icon="✅"
        type_color="$GREEN"
        shift 1
        ;;
      --warn | -w)
        type_icon="⚠️ "
        type_color="$YELLOW"
        shift 1
        ;;
      --error | -e)
        type_icon="❌"
        type_color="$RED"
        shift 1
        ;;
      --info | -i)
        type_icon="ℹ️"
        type_color="$GRAY"
        shift 1
        ;;
      --clear | -cl)
        clear_line=true
        shift 1
        ;;
      --inline | -in)
        is_inline=true
        shift 1
        ;;
      --silent | -sl)
        is_silent=true
        shift 1
        ;;
      *) shift 1 ;;
    esac
  done

  if [ "$is_silent" = true ] || [ -z "$msg" ]; then
    return 0
  fi

  local final_color="$type_color"
  case "$color_name" in
    green) final_color="$GREEN" ;;
    red) final_color="$RED" ;;
    yellow) final_color="$YELLOW" ;;
    blue) final_color="$BLUE" ;;
    gray) final_color="$GRAY" ;;
  esac

  local final_icon="${icon:-$type_icon}"

  local indent=""
  if [[ "$level" =~ ^[1-9][0-9]*$ ]]; then
    indent=$(printf '%*s' "$(((level - 1) * 3))" "")
  fi

  local start=""
  [ "$clear_line" = true ] && start=$'\r\033[K'

  local end=$'\n'
  [ "$is_inline" = true ] && end=""

  if [ -n "$final_icon" ]; then
    printf "%b${final_color}%s%b %b${NC}%b" "$start" "$indent" "$final_icon" "$msg" "$end"
  else
    printf "%b${final_color}%s%b${NC}%b" "$start" "$indent" "$msg" "$end"
  fi
}
