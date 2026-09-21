import React from 'react'

const NameColor = () => {
    const profile_colors = [
        'bg-blue-500',
        'bg-red-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-teal-500',
        'bg-orange-500',
        'bg-cyan-500',
    ];

    const getInitials = (name) => {
        if (!name) return ''
        return name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((item) => item?.[0].toUpperCase())
            .slice(0, 2)
            .join('');
    }

    const getColorFromName = (name) => {
        if (!name) return profile_colors[0];

        const hash = name
            .split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0);

        return profile_colors[hash % profile_colors.length];
    };

    return {getColorFromName, getInitials}
        
}

export default NameColor
