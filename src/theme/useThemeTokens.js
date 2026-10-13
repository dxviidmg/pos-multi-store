import { useTheme } from '@mui/material/styles';
import { colors } from './colors';

/** Tokens de color del modo actual (tarjeta destacada, pastillas). */
export const useThemeTokens = () => colors.modes[useTheme().palette.mode];
