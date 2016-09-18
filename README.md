rmv
===

mv with some regexp tricks

## Usage

```
> rmv

  Regexp-powered file renamer, mv with some extra tricks

  Usage
  $ rmv <options> find replace

  Options
  --dry,     -d    Don't rename files
  --recurse, -r    Recursively search for files
```

Replacements use standard `$1`, `$2`, `$3` with one extra feature. You can use `$file` in a replacement for easy access to the original file name without having to wrap the entire match in a capture.

## Example

```
C:\OneDrive\Pictures\Camera Roll>rmv -d "^vine-(\d\d)(\d\d)(\d\d)" 20$4-$2-$3\$file
DRY RUN - no files will be moved
Moving vine-010114_014926.mp4 to 2014-01-01\vine-010114_014926.mp4
Moving vine-010114_014928.mp4 to 2014-01-01\vine-010114_014928.mp4
Moving vine-010114_101135.mp4 to 2014-01-01\vine-010114_101135.mp4
Moving vine-110114_122612.mp4 to 2014-11-01\vine-110114_122612.mp4
Moving vine-180114_113436.mp4 to 2014-18-01\vine-180114_113436.mp4
Moving vine-271213_012753.mp4 to 2013-27-12\vine-271213_012753.mp4
Moving vine-271213_060706.mp4 to 2013-27-12\vine-271213_060706.mp4
Moving vine-271213_060852.mp4 to 2013-27-12\vine-271213_060852.mp4

C:\OneDrive\Pictures\Camera Roll>rmv "^vine-(\d\d)(\d\d)(\d\d)" 20$4-$2-$3\$file
Moving vine-010114_014926.mp4 to 2014-01-01\vine-010114_014926.mp4
Moving vine-010114_014928.mp4 to 2014-01-01\vine-010114_014928.mp4
Moving vine-010114_101135.mp4 to 2014-01-01\vine-010114_101135.mp4
Moving vine-110114_122612.mp4 to 2014-11-01\vine-110114_122612.mp4
Moving vine-180114_113436.mp4 to 2014-18-01\vine-180114_113436.mp4
Moving vine-271213_012753.mp4 to 2013-27-12\vine-271213_012753.mp4
Moving vine-271213_060706.mp4 to 2013-27-12\vine-271213_060706.mp4
Moving vine-271213_060852.mp4 to 2013-27-12\vine-271213_060852.mp4
```
