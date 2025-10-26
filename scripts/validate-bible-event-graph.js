#!/usr/bin/env node

/**
 * Bible Event Graph manifest validator
 *
 * Usage:
 *   node scripts/validate-bible-event-graph.js [path/to/manifest.json]
 *
 * The script enforces the JSON schema contract plus authoring rules
 * that JSON Schema alone cannot express (tree integrity, order uniqueness, etc.).
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_MANIFEST = path.join(
    ROOT_DIR,
    'docs',
    'bible-data',
    'bible-event-graph.demo.json'
);

const ALLOWED_EVENT_KEYS = new Set(['id', 'title', 'parent_id', 'attributes']);

function readJson(filePath) {
    try {
        const raw = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(raw);
    } catch (error) {
        throw new Error(`Unable to read "${filePath}": ${error.message}`);
    }
}

function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

function validateManifest(manifest) {
    const errors = [];
    const warnings = [];

    if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
        errors.push('Manifest root must be an object.');
        return { errors, warnings };
    }

    const { events } = manifest;
    if (!events || typeof events !== 'object' || Array.isArray(events)) {
        errors.push('Manifest must contain an "events" object.');
        return { errors, warnings };
    }

    const eventIds = Object.keys(events);
    if (eventIds.length === 0) {
        errors.push('"events" must contain at least one entry.');
        return { errors, warnings };
    }

    const orderByEvent = new Map();
    const parentByEvent = new Map();
    const childrenByParent = new Map();

    for (const [key, value] of Object.entries(events)) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            errors.push(`events.${key} must be an object.`);
            continue;
        }

        for (const prop of Object.keys(value)) {
            if (!ALLOWED_EVENT_KEYS.has(prop)) {
                errors.push(`events.${key} contains unexpected property "${prop}".`);
            }
        }

        if (!isNonEmptyString(value.id)) {
            errors.push(`events.${key}.id must be a non-empty string.`);
        } else if (value.id !== key) {
            errors.push(`events.${key}.id must match its key (expected "${key}", received "${value.id}").`);
        }

        if (!isNonEmptyString(value.title)) {
            errors.push(`events.${key}.title must be a non-empty string.`);
        }

        const parentId = value.parent_id ?? null;
        if (parentId !== null && !isNonEmptyString(parentId)) {
            errors.push(`events.${key}.parent_id must be null or a non-empty string.`);
        } else {
            parentByEvent.set(key, parentId);
            const parentKey = parentId === null ? '__ROOT__' : parentId;
            if (!childrenByParent.has(parentKey)) {
                childrenByParent.set(parentKey, []);
            }
            childrenByParent.get(parentKey).push(key);
        }

        if (!value.attributes || typeof value.attributes !== 'object' || Array.isArray(value.attributes)) {
            errors.push(`events.${key}.attributes must be an object.`);
        } else {
            for (const [attrKey, attrValue] of Object.entries(value.attributes)) {
                if (!Array.isArray(attrValue) || attrValue.length === 0) {
                    errors.push(`events.${key}.attributes["${attrKey}"] must be a non-empty array.`);
                    continue;
                }

                const invalidItems = attrValue.filter(
                    (item) => typeof item !== 'string' || item.trim().length === 0
                );
                if (invalidItems.length > 0) {
                    errors.push(
                        `events.${key}.attributes["${attrKey}"] must contain only non-empty strings.`
                    );
                }

                if (attrKey === 'order') {
                    if (attrValue.length !== 1) {
                        errors.push(`events.${key}.attributes.order must contain exactly one value.`);
                    } else if (!/^[0-9]+$/.test(attrValue[0])) {
                        errors.push(
                            `events.${key}.attributes.order must be an integer represented as digits only.`
                        );
                    } else {
                        orderByEvent.set(key, attrValue[0]);
                    }
                }
            }
        }
    }

    // Ensure parent references exist.
    for (const [eventId, parentId] of parentByEvent.entries()) {
        if (parentId && !events[parentId]) {
            errors.push(`events.${eventId}.parent_id references missing event "${parentId}".`);
        }
    }

    // Ensure at least one root event (parent_id null).
    const rootChildren = childrenByParent.get('__ROOT__') || [];
    if (rootChildren.length === 0) {
        errors.push('At least one root event (parent_id: null) is required.');
    }

    // Detect cycles via DFS.
    const adjacency = new Map();
    for (const eventId of eventIds) {
        adjacency.set(eventId, childrenByParent.get(eventId) || []);
    }

    const visited = new Set();
    const stack = new Set();

    function dfs(nodeId) {
        if (stack.has(nodeId)) {
            errors.push(`Cycle detected at event "${nodeId}".`);
            return;
        }
        if (visited.has(nodeId)) {
            return;
        }

        stack.add(nodeId);
        const children = adjacency.get(nodeId) || [];
        for (const child of children) {
            dfs(child);
        }
        stack.delete(nodeId);
        visited.add(nodeId);
    }

    for (const rootId of rootChildren) {
        dfs(rootId);
    }

    // There could be disconnected islands (parent points to non-root but not connected to root).
    // Run DFS for any remaining nodes to ensure cycles are caught everywhere.
    for (const eventId of eventIds) {
        if (!visited.has(eventId)) {
            dfs(eventId);
        }
    }

    // Validate sibling order uniqueness.
    for (const [parentKey, childIds] of childrenByParent.entries()) {
        const seenOrders = new Map();
        for (const childId of childIds) {
            const orderValue = orderByEvent.get(childId);
            if (!orderValue) {
                warnings.push(`events.${childId} is missing an order value and will render after ordered siblings.`);
                continue;
            }

            if (seenOrders.has(orderValue)) {
                const first = seenOrders.get(orderValue);
                errors.push(
                    `Duplicate order "${orderValue}" under parent "${parentKey === '__ROOT__' ? 'ROOT' : parentKey}" for events "${first}" and "${childId}".`
                );
            } else {
                seenOrders.set(orderValue, childId);
            }
        }
    }

    return { errors, warnings };
}

function main() {
    const targetPath = process.argv[2]
        ? path.resolve(process.argv[2])
        : DEFAULT_MANIFEST;

    console.log(`Validating Bible Event Graph manifest: ${targetPath}`);

    let manifest;
    try {
        manifest = readJson(targetPath);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }

    const { errors, warnings } = validateManifest(manifest);

    if (warnings.length > 0) {
        console.warn('Warnings:');
        for (const warning of warnings) {
            console.warn(`  • ${warning}`);
        }
    }

    if (errors.length > 0) {
        console.error('Validation failed with the following issues:');
        for (const error of errors) {
            console.error(`  • ${error}`);
        }
        process.exit(1);
    }

    console.log('✅ Manifest is valid.');
}

main();
