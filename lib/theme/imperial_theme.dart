// =========================================================================
// JARDINS DE BALI — MODERN LUXURY DESIGN SYSTEM (AIRBNB LUXE / ARCHITECTURAL DIGEST STYLE)
// Deep Obsidian (#0E130D), Champagne Gold (#C5A880), Warm Alabaster (#F8F6F0)
// Clean edge-to-edge visual rhythm, soft shadows, no bulky borders
// =========================================================================

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ImperialColors {
  static const Color primary = Color(0xFF0E130D); // Deep Obsidian
  static const Color primaryVariant = Color(0xFF161D15);
  static const Color onPrimary = Color(0xFFFFFFFF);
  static const Color accent = Color(0xFFC5A880); // Champagne Gold
  static const Color accentLight = Color(0xFFEADBCE);
  static const Color accentDark = Color(0xFF9E8055);
  static const Color background = Color(0xFFF9F8F5); // Soft Natural Alabaster
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceVariant = Color(0xFFF2EFE9);
  static const Color textPrimary = Color(0xFF111710);
  static const Color textSecondary = Color(0xFF555E53);
  static const Color textMuted = Color(0xFF8C958A);
  static const Color border = Color(0xFFEBE7DD);
  static const Color borderGold = Color(0x66C5A880);

  // Status
  static const Color available = Color(0xFF2E7D32);
  static const Color availableBg = Color(0xFFE8F5E9);
  static const Color reserved = Color(0xFFED6C02);
  static const Color reservedBg = Color(0xFFFFF3E0);
  static const Color sold = Color(0xFF607D8B);
  static const Color soldBg = Color(0xFFECEFF1);
}

class ImperialTheme {
  static TextStyle displayStyle({
    double fontSize = 24,
    FontWeight fontWeight = FontWeight.w700,
    Color color = ImperialColors.textPrimary,
    double letterSpacing = -0.2,
    double? height,
  }) {
    return GoogleFonts.playfairDisplay(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      letterSpacing: letterSpacing,
      height: height,
    );
  }

  static TextStyle brandTitleStyle({
    double fontSize = 24,
    FontWeight fontWeight = FontWeight.w700,
    Color color = Colors.white,
    double letterSpacing = 2.0,
  }) {
    return GoogleFonts.cinzel(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      letterSpacing: letterSpacing,
    );
  }

  static TextStyle bodyStyle({
    double fontSize = 14,
    FontWeight fontWeight = FontWeight.w400,
    Color color = ImperialColors.textPrimary,
    double? letterSpacing,
    double? height,
  }) {
    return GoogleFonts.plusJakartaSans(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      letterSpacing: letterSpacing,
      height: height,
    );
  }

  static ThemeData get themeData {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: ImperialColors.background,
      primaryColor: ImperialColors.primary,
      colorScheme: const ColorScheme.light(
        primary: ImperialColors.primary,
        secondary: ImperialColors.accent,
        surface: ImperialColors.surface,
        onPrimary: ImperialColors.onPrimary,
        onSecondary: ImperialColors.primary,
        onSurface: ImperialColors.textPrimary,
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme().apply(
        bodyColor: ImperialColors.textPrimary,
        displayColor: ImperialColors.textPrimary,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: ImperialColors.primary,
        foregroundColor: ImperialColors.onPrimary,
        elevation: 0,
        centerTitle: false,
      ),
      cardTheme: CardThemeData(
        color: ImperialColors.surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
      ),
    );
  }

  static List<BoxShadow> get modernCardShadow => [
        BoxShadow(
          color: Colors.black.withValues(alpha: 0.05),
          blurRadius: 20,
          offset: const Offset(0, 8),
        ),
      ];

  static List<BoxShadow> get cardShadow => modernCardShadow;

  static List<BoxShadow> get goldGlowShadow => [
        BoxShadow(
          color: ImperialColors.accent.withValues(alpha: 0.25),
          blurRadius: 25,
          offset: const Offset(0, 8),
        ),
      ];
}

/// Modern Pill Chip with sleek animations
class ImperialAnimatedChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;
  final IconData? icon;
  final bool darkTheme;

  const ImperialAnimatedChip({
    super.key,
    required this.label,
    required this.isSelected,
    required this.onTap,
    this.icon,
    this.darkTheme = false,
  });

  @override
  Widget build(BuildContext context) {
    // Elegant luxury styling: Gold gradient on dark theme, Obsidian on light theme
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: onTap,
        child: AnimatedContainer(
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeOutCubic,
        padding: EdgeInsets.symmetric(
          horizontal: isSelected ? 16 : 14,
          vertical: 8.5,
        ),
        decoration: BoxDecoration(
          gradient: isSelected
              ? (darkTheme
                  ? const LinearGradient(
                      colors: [
                        Color(0xFFDFBA73), // Warm Champagne Gold
                        Color(0xFFC5A880), // Jardins de Bali Gold
                        Color(0xFFA8895E), // Rich Deep Gold
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    )
                  : const LinearGradient(
                      colors: [
                        Color(0xFF1A2218),
                        Color(0xFF0E130D),
                      ],
                    ))
              : null,
          color: isSelected
              ? null
              : (darkTheme
                  ? Colors.white.withValues(alpha: 0.08)
                  : Colors.white),
          borderRadius: BorderRadius.circular(999),
          border: Border.all(
            color: isSelected
                ? (darkTheme
                    ? const Color(0xFFFFE8B8).withValues(alpha: 0.6)
                    : Colors.transparent)
                : (darkTheme
                    ? Colors.white.withValues(alpha: 0.12)
                    : const Color(0xFFEBE7DD)),
            width: 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: (darkTheme
                            ? const Color(0xFFC5A880)
                            : ImperialColors.primary)
                        .withValues(alpha: 0.35),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  )
                ]
              : [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.03),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  )
                ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[
              Icon(
                icon,
                size: 14,
                color: isSelected
                    ? (darkTheme ? const Color(0xFF0E130D) : Colors.white)
                    : (darkTheme ? Colors.white70 : ImperialColors.textSecondary),
              ),
              const SizedBox(width: 5),
            ],
            Text(
              label,
              style: ImperialTheme.bodyStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w500,
                color: isSelected
                    ? (darkTheme ? const Color(0xFF0E130D) : Colors.white)
                    : (darkTheme ? Colors.white70 : ImperialColors.textSecondary),
                letterSpacing: 0.2,
              ),
            ),
          ],
        ),
      ),
    ),
    );
  }
}

class StatusBadge extends StatelessWidget {
  final String status;
  final bool compact;

  const StatusBadge({
    super.key,
    required this.status,
    this.compact = false,
  });

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    String label;

    switch (status) {
      case 'Disponible':
        bg = const Color(0xFFE8F5E9);
        fg = const Color(0xFF2E7D32);
        label = 'DISPONIBLE';
        break;
      case 'Réservé':
        bg = const Color(0xFFFFF3E0);
        fg = const Color(0xFFED6C02);
        label = 'RÉSERVÉ';
        break;
      default:
        bg = const Color(0xFFECEFF1);
        fg = const Color(0xFF607D8B);
        label = 'VENDU';
    }

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: compact ? 8 : 10,
        vertical: compact ? 3.5 : 4.5,
      ),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 5,
            height: 5,
            decoration: BoxDecoration(
              color: fg,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 5),
          Text(
            label,
            style: ImperialTheme.bodyStyle(
              fontSize: compact ? 9 : 10,
              fontWeight: FontWeight.w700,
              color: fg,
              letterSpacing: 0.4,
            ),
          ),
        ],
      ),
    );
  }
}

/// Official BaytImmo Brand Typographic Logo Widget
class BaytImmoBrandLogo extends StatelessWidget {
  final double height;
  final bool showText;
  final bool darkText;

  const BaytImmoBrandLogo({
    super.key,
    this.height = 42,
    this.showText = true,
    this.darkText = false,
  });

  @override
  Widget build(BuildContext context) {
    if (!showText) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          'BAYTIMMO',
          style: ImperialTheme.displayStyle(
            fontSize: (height * 0.38).clamp(13.5, 20.0),
            fontWeight: FontWeight.w800,
            color: darkText ? ImperialColors.textPrimary : Colors.white,
            letterSpacing: 2.2,
          ),
        ),
        const SizedBox(height: 1),
        Text(
          'GROUPE IMMOBILIER',
          style: ImperialTheme.bodyStyle(
            fontSize: (height * 0.24).clamp(8.5, 12.0),
            fontWeight: FontWeight.w700,
            color: darkText ? ImperialColors.accentDark : ImperialColors.accent,
            letterSpacing: 1.4,
          ),
        ),
      ],
    );
  }
}

/// Smart Image Widget
class SmartAssetImage extends StatelessWidget {
  final String localPath;
  final String? remoteUrl;
  final BoxFit fit;
  final double? width;
  final double? height;
  final BorderRadius? borderRadius;

  const SmartAssetImage({
    super.key,
    required this.localPath,
    this.remoteUrl,
    this.fit = BoxFit.cover,
    this.width,
    this.height,
    this.borderRadius,
  });

  String get _normalizedAssetPath {
    if (localPath.startsWith('assets/')) return localPath;
    return 'assets/$localPath';
  }

  @override
  Widget build(BuildContext context) {
    Widget img = Image.asset(
      _normalizedAssetPath,
      width: width,
      height: height,
      fit: fit,
      errorBuilder: (context, error, stackTrace) {
        if (remoteUrl != null && remoteUrl!.isNotEmpty) {
          return Image.network(
            remoteUrl!,
            width: width,
            height: height,
            fit: fit,
            errorBuilder: (_, _, _) => _buildFallback(),
          );
        }
        return _buildFallback();
      },
    );

    if (borderRadius != null) {
      return ClipRRect(borderRadius: borderRadius!, child: img);
    }
    return img;
  }

  Widget _buildFallback() {
    return Container(
      width: width,
      height: height,
      color: ImperialColors.primaryVariant,
      alignment: Alignment.center,
      child: const Icon(
        Icons.apartment_rounded,
        color: ImperialColors.accent,
        size: 32,
      ),
    );
  }
}
