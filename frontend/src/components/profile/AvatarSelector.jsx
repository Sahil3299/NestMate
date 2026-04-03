import React, { useEffect, useMemo, useState } from "react";

const AVATAR_PRESETS = [
  { id: "preset-1", label: "Blue Star", letter: "S", classes: "from-blue-400 to-blue-700" },
  { id: "preset-2", label: "Ocean", letter: "O", classes: "from-sky-400 to-blue-600" },
  { id: "preset-3", label: "Indigo", letter: "I", classes: "from-indigo-400 to-blue-600" },
  { id: "preset-4", label: "Calm", letter: "C", classes: "from-cyan-400 to-blue-600" },
];

function getAvatarLetter(presetId) {
  const preset = AVATAR_PRESETS.find((p) => p.id === presetId);
  return preset?.letter || "N";
}

function getAvatarClasses(presetId) {
  const preset = AVATAR_PRESETS.find((p) => p.id === presetId);
  return preset?.classes || "from-blue-400 to-blue-700";
}

export default function AvatarSelector({
  avatarPreset,
  onChangeAvatarPreset,
  avatarFile,
  onChangeAvatarFile,
  previewSrc,
  fallbackLetter,
}) {
  const [localPreviewUrl, setLocalPreviewUrl] = useState(null);

  useEffect(() => {
    if (!avatarFile) {
      setLocalPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setLocalPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const effectivePreview = previewSrc || localPreviewUrl || null;

  const activePresetClasses = useMemo(
    () => getAvatarClasses(avatarPreset || "preset-1"),
    [avatarPreset]
  );

  const activeLetter = fallbackLetter || getAvatarLetter(avatarPreset || "preset-1");

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-semibold text-gray-900">Profile Photo</div>
        <div className="mt-1 text-sm text-gray-500">Upload an image or choose a preset avatar.</div>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex items-center justify-start">
          <div className="relative">
            {effectivePreview ? (
              <img
                src={effectivePreview}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm"
              />
            ) : (
              <div
                className={`w-24 h-24 rounded-full bg-gradient-to-br ${activePresetClasses} flex items-center justify-center text-white font-bold text-3xl shadow-sm`}
              >
                {activeLetter}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 cursor-pointer hover:border-gray-300 transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  onChangeAvatarFile(file);
                }}
              />
              <span className="text-sm font-semibold">Upload</span>
            </label>

            <button
              type="button"
              className="text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
              onClick={() => onChangeAvatarFile(null)}
              disabled={!avatarFile}
            >
              Remove upload
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-500">Choose a preset</div>
            <div className="grid grid-cols-4 gap-3">
              {AVATAR_PRESETS.map((p) => {
                const isActive = avatarPreset === p.id && !avatarFile;
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`rounded-full w-12 h-12 border flex items-center justify-center transition-all ${
                      isActive
                        ? "border-blue-500 ring-2 ring-blue-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => {
                      onChangeAvatarPreset(p.id);
                      if (avatarFile) onChangeAvatarFile(null);
                    }}
                    aria-label={p.label}
                    title={p.label}
                  >
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${p.classes} flex items-center justify-center text-white font-bold text-lg`}
                    >
                      {p.letter}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

