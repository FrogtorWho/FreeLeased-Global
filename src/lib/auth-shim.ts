// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
// FreeLeased — Auth module constants + types (no DB import).
//
// This file is the pure-types/constants surface of src/lib/auth.ts.
// The implementation that touches prisma lives in src/lib/auth.ts.
// Use this file when you only need the version + AuthError + types
// (e.g. in tests).

export const AUTH_VERSION = "17.0.0"

export class AuthError extends Error {
  status: 401 | 403
  constructor(message: string, status: 401 | 403) {
    super(message)
    this.name = "AuthError"
    this.status = status
  }
}
